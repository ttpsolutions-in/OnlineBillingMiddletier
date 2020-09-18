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
    builder.EntitySet<SaleQuantityAmountForReport>("SaleQuantityAmountForReports");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class SaleQuantityAmountForReportsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/SaleQuantityAmountForReports
        [EnableQuery]
        public IQueryable<SaleQuantityAmountForReport> GetSaleQuantityAmountForReports()
        {
            return db.SaleQuantityAmountForReports;
        }

        // GET: odata/SaleQuantityAmountForReports(5)
        [EnableQuery]
        public SingleResult<SaleQuantityAmountForReport> GetSaleQuantityAmountForReport([FromODataUri] DateTime key)
        {
            return SingleResult.Create(db.SaleQuantityAmountForReports.Where(saleQuantityAmountForReport => saleQuantityAmountForReport.SaleDate == key));
        }

        // PUT: odata/SaleQuantityAmountForReports(5)
        public async Task<IHttpActionResult> Put([FromODataUri] DateTime key, Delta<SaleQuantityAmountForReport> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SaleQuantityAmountForReport saleQuantityAmountForReport = await db.SaleQuantityAmountForReports.FindAsync(key);
            if (saleQuantityAmountForReport == null)
            {
                return NotFound();
            }

            patch.Put(saleQuantityAmountForReport);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleQuantityAmountForReportExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(saleQuantityAmountForReport);
        }

        // POST: odata/SaleQuantityAmountForReports
        public async Task<IHttpActionResult> Post(SaleQuantityAmountForReport saleQuantityAmountForReport)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.SaleQuantityAmountForReports.Add(saleQuantityAmountForReport);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SaleQuantityAmountForReportExists(saleQuantityAmountForReport.SaleDate))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(saleQuantityAmountForReport);
        }

        // PATCH: odata/SaleQuantityAmountForReports(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] DateTime key, Delta<SaleQuantityAmountForReport> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            SaleQuantityAmountForReport saleQuantityAmountForReport = await db.SaleQuantityAmountForReports.FindAsync(key);
            if (saleQuantityAmountForReport == null)
            {
                return NotFound();
            }

            patch.Patch(saleQuantityAmountForReport);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleQuantityAmountForReportExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(saleQuantityAmountForReport);
        }

        // DELETE: odata/SaleQuantityAmountForReports(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] DateTime key)
        {
            SaleQuantityAmountForReport saleQuantityAmountForReport = await db.SaleQuantityAmountForReports.FindAsync(key);
            if (saleQuantityAmountForReport == null)
            {
                return NotFound();
            }

            db.SaleQuantityAmountForReports.Remove(saleQuantityAmountForReport);
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

        private bool SaleQuantityAmountForReportExists(DateTime key)
        {
            return db.SaleQuantityAmountForReports.Count(e => e.SaleDate == key) > 0;
        }
    }
}
