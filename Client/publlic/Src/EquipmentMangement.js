

    $(document).ready(function() {
        $.ajax({
            url: '/api/v1/equipment/view',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let tbody = $('.equipment-list tbody');
                tbody.empty();
                data.forEach(function(item) {
                    tbody.append(`
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.category}</td>
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




