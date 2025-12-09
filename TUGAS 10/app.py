from flask import Flask, render_template, request, redirect, session
import mysql.connector

app = Flask(__name__)
app.secret_key = "secret123"

# Koneksi ke MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="harfandi123",
    port=3306,
    database="db_minimarket"
)

cursor = db.cursor(dictionary=True)

# ============================
#   HALAMAN UTAMA
# ============================
@app.route("/")
def index():
    cursor.execute("SELECT * FROM barang")
    products = cursor.fetchall()
    return render_template("index.html", products=products)

# ============================
#   DETAIL PRODUK
# ============================
@app.route("/product_detail/<int:kode>")
def product_detail(kode):
    cursor.execute("SELECT * FROM barang WHERE kode=%s", (kode,))
    product = cursor.fetchone()
    return render_template("product_detail.html", product=product)

# ============================
#   ADD TO CART
# ============================
@app.route("/cart/add/<int:kode>")
def add_to_cart(kode):
    if "cart" not in session:
        session["cart"] = []
    session["cart"].append(kode)
    return redirect("/cart")

# ============================
#   CART PAGE
# ============================
@app.route("/cart")
def cart():
    if "cart" not in session:
        session["cart"] = []

    cart_items = []
    for kode in session["cart"]:
        cursor.execute("SELECT * FROM barang WHERE kode=%s", (kode,))
        cart_items.append(cursor.fetchone())

    return render_template("cart.html", cart_items=cart_items)

# ============================
#   CHECKOUT
# ============================
@app.route("/checkout")
def checkout():
    return render_template("checkout.html")


if __name__ == "__main__":
    app.run(debug=True)
