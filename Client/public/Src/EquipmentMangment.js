

    $(document).ready(function() {
        $.ajax({
            url: 'http://localhost:3000/api/v1/equipment/view',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                $('.equipment-list').empty();
                data.forEach(function(item) {
                    $('.equipment-list').append(`
                        <tr>
                            <td>${item.equipment_name}</td>
                            <td>${item.category_id}</td>
                            <td>${item.supplier}</td>
                            <td>${item.quantity}</td>
                            <td>${item.status}</td>

                        </tr>
                    `);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching data:', error);
            }
        });
    });




