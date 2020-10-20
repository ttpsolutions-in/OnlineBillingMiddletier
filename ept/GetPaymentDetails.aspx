<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="GetPaymentDetails.aspx.cs" Inherits="ept.PaymntDetail" %>

<html lang="en" data-ng-app="ETradersApp">
<head>
    <title>Ephraim Traders</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link type="text/css" href="vContent/style/bootstrap.min.css" rel="stylesheet" />
    <link type="text/css" href="vContent/style/ng-tags-input.min.css" rel="stylesheet" />
    <!--<link href="vContent/style/customstyle.css" rel="stylesheet" />-->
    <link type="text/css" href="vContent/style/select2.min.css" rel="stylesheet" />
    <link type="text/css" href="vContent/sweetalert.css" rel="stylesheet" />
    <link type="text/css" href="vContent/style/toaster.min.css" rel="stylesheet" />
    <link type="text/css" href="vContent/style/dashboard.css" rel="stylesheet" />
    <link type="text/css" href="vContent/style/ui-grid.min.css" rel="stylesheet" />
    <link type="text/css" href="vContent/style/libs.min.css" rel="stylesheet" />
    <link type="text/css" href="vAsset/Content/bootstrap.min.css" rel="stylesheet" />
    <!--<link href="vAsset/Content/ProjectStyle.css" rel="stylesheet" />-->
    <style>
        .loader {
            border: 10px solid #f3f3f3; /* Light grey */
            border-top: 10px solid #90ee90; /* Blue */
            border-bottom: 10px solid #90ee90;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        html, body, container {
            height: 100%;
            width: 100%;
            margin: 0;
        }

        .collapse {
            display: none !important;
        }

        form input.ng-invalid {
            border-color: red;
        }

        form input.ng-valid {
            border-color: transparent;
        }

        input[type="checkbox"] {
            margin: 0 0 0 !important;
        }

        .btn {
            background-color: #6a6868;
            border: none;
            color: white;
            padding: 5px 10px 5px 10px;
            text-align: center;
            font-size: 14px;
            margin: 5px 2px;
            opacity: 0.6;
            transition: 0.3s;
        }

            .btn:hover {
                opacity: 1
            }

        .btn-xs {
            padding: 2px 2px 2px 2px;
        }

        .logoCls {
            padding-top: 10px;
            padding-right: 10px;
            padding-bottom: 5px;
            border-radius: 13px;
            box-shadow: 2px 2px;
            width: 250px;
            border: 0;
        }
    </style>
</head>
<body>
    <div class="card-body">
        <form name="addPaymentForm" runat="server">
            <div class="form-row">
                <div class="form-group col-md-4 col-md-offset-4">
                    <label for="Description">Payment Id</label>
                    <asp:DropDownList ID="ddlPaymentId" runat="server"></asp:DropDownList>
                </div>
                <div class="form-group col-md-4 col-md-offset-4">
                    <label for="Name">Tran Id</label>
                    <asp:DropDownList ID="ddlTranId" runat="server"></asp:DropDownList>
                </div>
                <div class="form-group col-md-4 col-md-offset-4">
                    <asp:Button ID="submit" runat="server" CssClass="btn btn-primary" Text="Proceed" OnClick="submit_Click" />
                </div>
            </div>

            <asp:GridView ID="GridView1" runat="server">
            </asp:GridView>

        </form>
    </div>
</body>
</html>
