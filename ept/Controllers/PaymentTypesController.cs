using System;
using System.Collections.Generic;
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

namespace ept.Controllers
{
    /*
    The WebApiConfig class may require additional changes to add a route for this controller. Merge these statements into the Register method of the WebApiConfig class as applicable. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using System.Web.Http.OData.Extensions;
    using ept.Models;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<PaymentType>("PaymentTypes");
    builder.EntitySet<EmployeeAccount>("EmployeeAccounts"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class PaymentTypesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/PaymentTypes
        [EnableQuery]
        public IQueryable<PaymentType> GetPaymentTypes()
        {
            return db.PaymentTypes;
        }

        // GET: odata/PaymentTypes(5)
        [EnableQuery]
        public SingleResult<PaymentType> GetPaymentType([FromODataUri] byte key)
        {
            return SingleResult.Create(db.PaymentTypes.Where(paymentType => paymentType.PaymentTypeId == key));
        }

        // PUT: odata/PaymentTypes(5)
        public async Task<IHttpActionResult> Put([FromODataUri] byte key, Delta<PaymentType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PaymentType paymentType = await db.PaymentTypes.FindAsync(key);
            if (paymentType == null)
            {
                return NotFound();
            }

            patch.Put(paymentType);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(paymentType);
        }

        // POST: odata/PaymentTypes
        public async Task<IHttpActionResult> Post(PaymentType paymentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PaymentTypes.Add(paymentType);
            await db.SaveChangesAsync();

            return Created(paymentType);
        }

        // PATCH: odata/PaymentTypes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] byte key, Delta<PaymentType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            PaymentType paymentType = await db.PaymentTypes.FindAsync(key);
            if (paymentType == null)
            {
                return NotFound();
            }

            patch.Patch(paymentType);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(paymentType);
        }

        // DELETE: odata/PaymentTypes(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] byte key)
        {
            PaymentType paymentType = await db.PaymentTypes.FindAsync(key);
            if (paymentType == null)
            {
                return NotFound();
            }

            db.PaymentTypes.Remove(paymentType);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/PaymentTypes(5)/EmployeeAccounts
        [EnableQuery]
        public IQueryable<EmployeeAccount> GetEmployeeAccounts([FromODataUri] byte key)
        {
            return db.PaymentTypes.Where(m => m.PaymentTypeId == key).SelectMany(m => m.EmployeeAccounts);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PaymentTypeExists(byte key)
        {
            return db.PaymentTypes.Count(e => e.PaymentTypeId == key) > 0;
        }
    }
}
