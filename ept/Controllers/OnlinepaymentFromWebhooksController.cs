using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using ept.Models;
using InstamojoAPI;

namespace ept.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using ept.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<OnlinepaymentFromWebhook>("OnlinepaymentFromWebhooks");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    [AllowAnonymous]
    public class OnlinepaymentFromWebhooksController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/OnlinepaymentFromWebhooks
        [EnableQuery]
        public IQueryable<OnlinepaymentFromWebhook> GetOnlinepaymentFromWebhooks()
        {
            return db.OnlinepaymentFromWebhooks;
        }

        // GET: odata/OnlinepaymentFromWebhooks(5)
        [EnableQuery]
        public SingleResult<OnlinepaymentFromWebhook> GetOnlinepaymentFromWebhook([FromODataUri] int key)
        {
            return SingleResult.Create(db.OnlinepaymentFromWebhooks.Where(onlinepaymentFromWebhook => onlinepaymentFromWebhook.autoId == key));
        }

        // PUT: odata/OnlinepaymentFromWebhooks(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<OnlinepaymentFromWebhook> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            OnlinepaymentFromWebhook onlinepaymentFromWebhook = await db.OnlinepaymentFromWebhooks.FindAsync(key);
            if (onlinepaymentFromWebhook == null)
            {
                return NotFound();
            }

            patch.Put(onlinepaymentFromWebhook);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OnlinepaymentFromWebhookExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(onlinepaymentFromWebhook);
        }

        // POST: odata/OnlinepaymentFromWebhooks
        public async Task<IHttpActionResult> Post(OnlinepaymentFromWebhook onlinepaymentFromWebhook)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            string Insta_client_id = ConfigurationManager.AppSettings["ClientId"];//,//   "test_sFhb8ig0JPT0Hc21G2CWZg4RqhO4d3KqMdO",
            string Insta_client_secret = ConfigurationManager.AppSettings["ClientSecret"];//, //"test_7VCjAHfdUrQMtlvUwYUEtAFbYJuvAGZ1Pu63WUfSBWOgsmW8Oa3rgx6AmOsi8UuXeZ3zbFyuPFJMXbEd9rppVFSTXALInXFS3Oa7Ux1hB5NQKAh9OnzvqTSHcV8",
            string Insta_Endpoint = "";//ConfigurationManager.AppSettings["APIEndpoint"],// InstamojoConstants.INSTAMOJO_API_ENDPOINT,
            string Insta_Auth_Endpoint = "";//ConfigurationManager.AppSettings["AuthEndpoint"];// InstamojoConstants.INSTAMOJO_AUTH_ENDPOINT;

            Insta_Endpoint = ConfigurationManager.AppSettings["APIEndpoint"];
            Insta_Auth_Endpoint = ConfigurationManager.AppSettings["AuthEndpoint"];

            Insta_client_id = ConfigurationManager.AppSettings["ClientId"];
            Insta_client_secret = ConfigurationManager.AppSettings["ClientSecret"];
            Instamojo objClass = InstamojoImplementation.getApi(Insta_client_id, Insta_client_secret, Insta_Endpoint, Insta_Auth_Endpoint);


            PaymentOrderDetailsResponse objPaymentRequestStatusResponse = objClass.getPaymentOrderDetails(onlinepaymentFromWebhook.id);
            List<PaymentOrderDetailsResponse> objlist = new List<PaymentOrderDetailsResponse>();
            objlist.Add(objPaymentRequestStatusResponse);

            onlinepaymentFromWebhook.status = objPaymentRequestStatusResponse.status;
            onlinepaymentFromWebhook.buyer = objPaymentRequestStatusResponse.email;
            onlinepaymentFromWebhook.buyer_name = objPaymentRequestStatusResponse.name;
            onlinepaymentFromWebhook.buyer_phone = objPaymentRequestStatusResponse.phone;
            onlinepaymentFromWebhook.purpose = objPaymentRequestStatusResponse.description;
            onlinepaymentFromWebhook.createdon = Convert.ToDateTime(objPaymentRequestStatusResponse.created_at);
            onlinepaymentFromWebhook.currency = objPaymentRequestStatusResponse.currency;
            onlinepaymentFromWebhook.amount = objPaymentRequestStatusResponse.amount;

            db.OnlinepaymentFromWebhooks.Add(onlinepaymentFromWebhook);
            await db.SaveChangesAsync();

            return Created(onlinepaymentFromWebhook);
        }

        // PATCH: odata/OnlinepaymentFromWebhooks(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<OnlinepaymentFromWebhook> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            OnlinepaymentFromWebhook onlinepaymentFromWebhook = await db.OnlinepaymentFromWebhooks.FindAsync(key);
            if (onlinepaymentFromWebhook == null)
            {
                return NotFound();
            }

            patch.Patch(onlinepaymentFromWebhook);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OnlinepaymentFromWebhookExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(onlinepaymentFromWebhook);
        }

        // DELETE: odata/OnlinepaymentFromWebhooks(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            OnlinepaymentFromWebhook onlinepaymentFromWebhook = await db.OnlinepaymentFromWebhooks.FindAsync(key);
            if (onlinepaymentFromWebhook == null)
            {
                return NotFound();
            }

            db.OnlinepaymentFromWebhooks.Remove(onlinepaymentFromWebhook);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OnlinepaymentFromWebhookExists(int key)
        {
            return db.OnlinepaymentFromWebhooks.Count(e => e.autoId == key) > 0;
        }
    }
}
