ETradersApp.controller('MyController', function ($scope) {
    $scope.Customers = [
        { CustomerId: 1, Name: "John Hammond", Country: "United States" },
        { CustomerId: 2, Name: "Mudassar Khan", Country: "India" },
        { CustomerId: 3, Name: "Suzanne Mathews", Country: "France" },
        { CustomerId: 4, Name: "Robert Schidner", Country: "Russia" }
    ];

    $scope.Export = function () {
        html2canvas(document.getElementById('tblCustomers'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Table.pdf");
            }
        });
    }
});