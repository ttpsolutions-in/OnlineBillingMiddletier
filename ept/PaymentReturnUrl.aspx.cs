using ept.Controllers;
using ept.Models;
using InstamojoAPI;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Configuration;
using System.Configuration;
using System.Web.WebPages;
using Microsoft.Ajax.Utilities;

namespace ept
{
    public partial class PaymentReturnUrl : System.Web.UI.Page
    {
        private EphraimTradersEntities db;
        protected void Page_Load(object sender, EventArgs e)
        {
            string payment_id = string.Empty;
            string transaction_id = string.Empty;
            string id = string.Empty;
            string payment_status = string.Empty;


            if (Request.QueryString["payment_id"] != null)
            {
                payment_id = Request.QueryString["payment_id"];
                PaymentId.Value = payment_id;
            }
            if (Request.QueryString["transaction_id"] != null)
            {
                transaction_id = Request.QueryString["transaction_id"];
                TransactionId.Value = transaction_id;
            }
            if (Request.QueryString["id"] != null)
            {
                id = Request.QueryString["id"];
                RequestId.Value = id;
            }
            if (Request.QueryString["payment_status"] != null)
            {
                payment_status = Request.QueryString["payment_status"];
                PaymentStatus.Value = payment_status;
            }

            //db = new EphraimTradersEntities();


            //if (!IsPostBack)
            //{

            //    if (!id.IsNullOrWhiteSpace())
            //    {
            //        //try
            //        //{
            //        var newPayment = false;
            //        List<string> paymentIdArray = new List<string>();

            //        if (Session["PaymentArray"] == null)
            //        {
            //            paymentIdArray.Add(payment_id);
            //            Session["PaymentArray"] = paymentIdArray;
            //            newPayment = true;
            //        }
            //        else
            //        {
            //            paymentIdArray = Session["PaymentArray"] as List<string>;
            //            if (!paymentIdArray.Contains(payment_id))
            //            {
            //                paymentIdArray.Add(payment_id);
            //                newPayment = true;
            //            }
            //        }
            //        if (newPayment)
            //        {
            //            var onlinepayment = db.OnlinePaymentDetails.First(item => item.TransactionId == transaction_id);
            //            onlinepayment.PaymentStatus = payment_status;
            //            onlinepayment.InstamojoPaymentId = payment_id;
            //            db.SaveChanges();

            //            //insert into Bills table only if the payment is successful.
            //            if (payment_status.ToLower() == "credit")
            //            {
            //                //var billduplicate = db.Bills.First(item=>item.SaleCategoryId ==3
            //                //Bill objBill = new Bill();
            //                //objBill.GrandTotal = onlinepayment.amount;
            //                //objBill.RetailerId = Convert.ToInt32(Session["RetailerId"]);
            //                //objBill.SaleTypeId = 3;//payment
            //                //objBill.SaleCategoryId = 3;//payment
            //                //objBill.TotalAmount = 0;
            //                //objBill.PaidAmt = 0;
            //                //objBill.GSTAmount = 0;
            //                //objBill.GSTApplied = 0;
            //                //objBill.GSTPercentage = 0;
            //                //objBill.SaleDate = DateTime.Now;
            //                //objBill.BillStatus = 1;
            //                //db.Bills.Add(objBill);
            //                //db.SaveChanges();
            //                lblMessage.Text = "Payment successful.";
            //            }
            //        }
            //        else
            //        {
            //            lblMessage.Text = "The server gone nuts.";
            //        }
            //        /*}
            //        catch (Exception ex)
            //        {
            //            lblMessage.Text = ex..Message;
            //        }*/
            //    }
            //}
        }

        protected void Redirect_Click(object sender, EventArgs e)
        {
            Response.Redirect("~/index.html#/home");
        }
    }

}