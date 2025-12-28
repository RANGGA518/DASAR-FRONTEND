from flask import Flask, render_template, request, redirect, session, jsonify
import mysql.connector
import os
from werkzeug.utils import secure_filename
import math

app = Flask(__name__)
app.secret_key = "secret123"

@app.before_request
def init_cart():
    if "cart" not in session:
        session["cart"] = {}

UPLOAD_FOLDER = "static/img"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ======================
# DATABASE
# ======================
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="harfandi123",
    database="uas_projek"
)
cursor = db.cursor(dictionary=True)

# ======================
# USER
# ======================
@app.route("/")
def index():
    keyword = request.args.get("q")
    pesan = None

    cursor.execute("SELECT * FROM kategori")
    kategori = cursor.fetchall()

    if keyword:
        cursor.execute("""
            SELECT kode_barang
            FROM produk
            WHERE nama_barang LIKE %s
            LIMIT 1
        """, (f"%{keyword}%",))
        hasil = cursor.fetchone()

        if hasil:
            return redirect(f"/product/{hasil['kode_barang']}")
        else:
            pesan = "Produk tidak ditemukan"

    cursor.execute("""
        SELECT *
        FROM produk
        ORDER BY CAST(kode_barang AS UNSIGNED) DESC
        LIMIT 12
    """)
    produk_rekomendasi = cursor.fetchall()

    return render_template(
    "USER/index.html",
    kategori=kategori,
    produk_rekomendasi=produk_rekomendasi,
    keyword=keyword,
    pesan=pesan,
    cart_count=get_cart_count()
)

@app.route("/profile")
def profile():
    if "user_id" not in session:
        return redirect("/login")

    cursor.execute(
        "SELECT id, username, email FROM users WHERE id=%s",
        (session["user_id"],)
    )
    user = cursor.fetchone()

    if not user:
        session.clear()
        return redirect("/login")

    return render_template("USER/akun.html", user=user)

# ======================
# KATEGORI
# ======================
@app.route("/kategori/<int:kategori_id>")
def produk_per_kategori(kategori_id):
    cursor.execute("""
        SELECT 
            p.*,
            IFNULL(p.deskripsi,'') AS deskripsi,
            k.nama_kategori
        FROM produk p
        JOIN kategori k ON p.kategori_id = k.id
        WHERE p.kategori_id=%s
    """, (kategori_id,))
    products = cursor.fetchall()

    cursor.execute("SELECT nama_kategori FROM kategori WHERE id=%s", (kategori_id,))
    kategori = cursor.fetchone()

    return render_template(
        "USER/produk_kategori.html",
        products=products,
        kategori=kategori
    )

# ======================
# DETAIL PRODUK
# ======================
@app.route("/product/<kode>")
def product_detail(kode):
    cursor.execute("""
        SELECT *
        FROM produk
        WHERE kode_barang=%s
    """, (kode,))
    product = cursor.fetchone()

    if not product:
        return redirect("/")

    return render_template(
        "USER/product_detail.html",
        product=product
    )

@app.template_filter("rupiah")
def rupiah(value):
    return "{:,.0f}".format(value).replace(",", ".")


# ======================
# TAMBAH KE CART 
# ======================
@app.route("/add-to-cart", methods=["POST"])
def add_to_cart():
    kode = request.form["kode"]
    qty = int(request.form["qty"])

    cursor.execute("""
        SELECT kode_barang, nama_barang, harga, gambar
        FROM produk
        WHERE kode_barang=%s
    """, (kode,))
    produk = cursor.fetchone()

    if not produk:
        return redirect("/")

    cart = session.get("cart", {})

    if kode in cart:
        cart[kode]["qty"] += qty
    else:
        cart[kode] = {
            "nama": produk["nama_barang"],
            "harga": int(produk["harga"]),
            "qty": qty,
            "gambar": produk["gambar"]
        }

    session["cart"] = cart
    session.modified = True

    return redirect("/")

def get_cart_count():
    cart = session.get("cart", {})
    return len(cart)

@app.route("/cart")
def cart():
    cart = session.get("cart", {})

    total = 0
    for item in cart.values():
        harga = int(item["harga"])
        qty = int(item["qty"])
        total += harga * qty

    return render_template(
        "USER/cart.html",
        cart=cart,
        total=total
    )

@app.route("/cart/delete/<kode>")
def cart_delete(kode):
    cart = session.get("cart", {})
    cart.pop(kode, None)
    session["cart"] = cart
    session.modified = True
    return redirect("/cart")

@app.route("/cart/update", methods=["POST"])
def cart_update():
    data = request.get_json()
    kode = data["kode"]
    delta = int(data["delta"])

    cart = session.get("cart", {})

    if kode not in cart:
        return jsonify({"success": False})

    cart[kode]["qty"] += delta

    if cart[kode]["qty"] <= 0:
        cart.pop(kode)
    else:
        session["cart"] = cart

    session.modified = True

    # hitung ulang total
    total = 0
    for item in cart.values():
        total += int(item["harga"]) * int(item["qty"])

    return jsonify({
        "success": True,
        "qty": cart.get(kode, {}).get("qty", 0),
        "total": "Rp {:,.0f}".format(total).replace(",", ".")
    })

# ======================
# LOGIN / REGISTER 
# ======================
@app.route("/login", methods=["GET", "POST"])
def login():
    error = None

    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()

        if not user:
            error = "Username tidak ditemukan"
        elif user["email"] != email:
            error = "Email tidak sesuai"
        elif user["password"] != password:
            error = "Password salah"
        else:
            session["user"] = user["username"]
            session["user_id"] = user["id"]
            return redirect("/")

    return render_template("USER/login.html", error=error)

@app.route("/register", methods=["GET", "POST"])
def register():
    error = None

    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        cursor.execute("SELECT id FROM users WHERE username=%s", (username,))
        if cursor.fetchone():
            error = "Username sudah digunakan"
        else:
            cursor.execute("""
                INSERT INTO users (username, email, password)
                VALUES (%s,%s,%s)
            """, (username, email, password))
            db.commit()
            return redirect("/login")

    return render_template("USER/register.html", error=error)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

# ======================
# ADMIN (TIDAK DIUBAH)
# ======================
@app.route("/admin")
def admin_pilih_kategori():
    cursor.execute("SELECT * FROM kategori")
    kategori = cursor.fetchall()
    return render_template("ADMIN/pilih_kategori.html", kategori=kategori)

@app.route("/admin/kategori/<int:kategori_id>")
def admin_produk_kategori(kategori_id):
    keyword = request.args.get("keyword", "")
    page = request.args.get("page", 1, type=int)
    limit = 5
    offset = (page - 1) * limit

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM produk
        WHERE kategori_id=%s
    """, (kategori_id,))
    total_data = cursor.fetchone()["total"]
    total_page = math.ceil(total_data / limit)

    cursor.execute("""
        SELECT 
            p.*,
            IFNULL(p.deskripsi,'') AS deskripsi,
            k.nama_kategori
        FROM produk p
        JOIN kategori k ON p.kategori_id = k.id
        WHERE p.kategori_id=%s
        LIMIT %s OFFSET %s
    """, (kategori_id, limit, offset))

    data = cursor.fetchall()

    return render_template(
        "ADMIN/index.html",
        data=data,
        kategori_id=kategori_id,
        page=page,
        total_page=total_page
    )

@app.route("/admin/add", methods=["GET","POST"])
def admin_add():
    kategori_id = request.args.get("kategori")

    if request.method == "POST":
        file = request.files["gambar"]
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))

        cursor.execute("""
            INSERT INTO produk
            (kode_barang, nama_barang, deskripsi, stok, harga, kategori_id, gambar)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            request.form["kode_barang"],
            request.form["nama_barang"],
            request.form["deskripsi"],
            request.form["stok"],
            request.form["harga"],
            request.form["kategori_id"],
            filename
        ))
        db.commit()
        return redirect(f"/admin/kategori/{kategori_id}")

    return render_template("ADMIN/add.html", kategori_id=kategori_id)

@app.route("/admin/edit/<kode>", methods=["GET","POST"])
def admin_edit(kode):
    kategori_id = request.args.get("kategori")

    cursor.execute("SELECT * FROM produk WHERE kode_barang=%s", (kode,))
    produk = cursor.fetchone()

    if request.method == "POST":
        file = request.files.get("gambar")
        nama_file = produk["gambar"]

        if file and file.filename:
            nama_file = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, nama_file))

        cursor.execute("""
            UPDATE produk SET
            nama_barang=%s,
            deskripsi=%s,
            stok=%s,
            harga=%s,
            gambar=%s
            WHERE kode_barang=%s
        """, (
            request.form["nama_barang"],
            request.form["deskripsi"],
            request.form["stok"],
            request.form["harga"],
            nama_file,
            kode
        ))
        db.commit()
        return redirect(f"/admin/kategori/{kategori_id}")

    return render_template("ADMIN/edit.html", produk=produk, kategori_id=kategori_id)

@app.route("/admin/delete/<kode>")
def admin_delete(kode):
    kategori_id = request.args.get("kategori")
    cursor.execute("DELETE FROM produk WHERE kode_barang=%s", (kode,))
    db.commit()
    return redirect(f"/admin/kategori/{kategori_id}")

if __name__ == "__main__":
    app.run(debug=True)
