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
    builder.EntitySet<DailySalesReportView>("DailySalesReportViews");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class DailySalesReportViewsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/DailySalesReportViews
        [EnableQuery]
        public IQueryable<DailySalesReportView> GetDailySalesReportViews()
        {
            return db.DailySalesReportViews;
        }

        // GET: odata/DailySalesReportViews(5)
        [EnableQuery]
        public SingleResult<DailySalesReportView> GetDailySalesReportView([FromODataUri] DateTime key)
        {
            return SingleResult.Create(db.DailySalesReportViews.Where(dailySalesReportView => dailySalesReportView.SaleDate == key));
        }

        // PUT: odata/DailySalesReportViews(5)
        public async Task<IHttpActionResult> Put([FromODataUri] DateTime key, Delta<DailySalesReportView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DailySalesReportView dailySalesReportView = await db.DailySalesReportViews.FindAsync(key);
            if (dailySalesReportView == null)
            {
                return NotFound();
            }

            patch.Put(dailySalesReportView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DailySalesReportViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(dailySalesReportView);
        }

        // POST: odata/DailySalesReportViews
        public async Task<IHttpActionResult> Post(DailySalesReportView dailySalesReportView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DailySalesReportViews.Add(dailySalesReportView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (DailySalesReportViewExists(dailySalesReportView.SaleDate))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(dailySalesReportView);
        }

        // PATCH: odata/DailySalesReportViews(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] DateTime key, Delta<DailySalesReportView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DailySalesReportView dailySalesReportView = await db.DailySalesReportViews.FindAsync(key);
            if (dailySalesReportView == null)
            {
                return NotFound();
            }

            patch.Patch(dailySalesReportView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DailySalesReportViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(dailySalesReportView);
        }

        // DELETE: odata/DailySalesReportViews(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] DateTime key)
        {
            DailySalesReportView dailySalesReportView = await db.DailySalesReportViews.FindAsync(key);
            if (dailySalesReportView == null)
            {
                return NotFound();
            }

            db.DailySalesReportViews.Remove(dailySalesReportView);
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

        private bool DailySalesReportViewExists(DateTime key)
        {
            return db.DailySalesReportViews.Count(e => e.SaleDate == key) > 0;
        }
    }
}
