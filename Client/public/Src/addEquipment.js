$(document).ready(function() {
    $('#submitEquipmentBtn').click(function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Gather form data
        var formData = {
            equipment_name: $('#equipment-name').val(),
            equipment_img: $('#equipment-img').val(),
            rating: $('#rating').val(),
            model_number: $('#model_number').val(),
            purchase_date: $('#purchase_date').val(),
            quantity: $('#quantity').val(),
            status: $('#status').val(),
            location: $('#location').val(),
            category_id: $('#category_id').val(),
            supplier_id: $('#supplier_id').val()
        };

    
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/api/v1/equipment/new', 
            data: formData,
            success: function(response) {
                // Handle success response
                alert('Equipment added successfully!');
            },
            error: function(error) {
                // Handle error response
                alert('Error adding equipment. Please try again.');
            }
        });
    });
});