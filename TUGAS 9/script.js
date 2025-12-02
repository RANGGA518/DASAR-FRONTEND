$(function () {

    // ------------------------------
    // Tabs Kategori (jika digunakan)
    // ------------------------------
    $("#tabs").tabs();


    // ------------------------------
    // Slider Filter Harga (Range)
    // ------------------------------
    $("#priceSlider").slider({
        range: true,
        min: 0,
        max: 500000,
        values: [50000, 300000],
        slide: function (event, ui) {

            $("#priceLabel").text(
                "Rp " + ui.values[0].toLocaleString("id-ID")
                + " - Rp " + ui.values[1].toLocaleString("id-ID")
            );

            filterProducts(ui.values[0], ui.values[1]);
        }
    });

    $("#priceLabel").text("Rp 50.000 - Rp 300.000");


    // ------------------------------
    // Fungsi Filter Harga
    // ------------------------------
    function filterProducts(min, max) {
        $(".product-card").each(function () {

            let price = parseInt($(this).data("price"));

            if (price >= min && price <= max) {
                $(this).show();
            } else {
                $(this).hide();
            }

        });
    }


    // ------------------------------
    // Keranjang (Dialog)
    // ------------------------------
    $("#cartDialog").dialog({
        autoOpen: false,
        width: 400
    });

    $("#openCart").click(function () {
        $("#cartDialog").dialog("open");
    });


    // ------------------------------
    // Tambah ke Keranjang
    // ------------------------------
    let cart = [];

    $(".addToCart").click(function () {

        let name = $(this).siblings("h4").text();
        let price = parseInt($(this).parent().data("price"));

        cart.push({ name: name, price: price });

        updateCart();

        $("#cartDialog").dialog("open");
    });


    // ------------------------------
    // Update Keranjang
    // ------------------------------
    function updateCart() {
        $("#cartItems").empty();
        let total = 0;

        cart.forEach(item => {
            $("#cartItems").append(`
                <li>${item.name} - Rp ${item.price.toLocaleString("id-ID")}</li>
            `);

            total += item.price;
        });

        $("#cartTotal").text(total.toLocaleString("id-ID"));
    }

});
