using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    builder.EntitySet<GSTPercentage>("GSTPercentages");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class GSTPercentagesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/GSTPercentages
        [EnableQuery]
        public IQueryable<GSTPercentage> GetGSTPercentages()
        {
            return db.GSTPercentages;
        }

        // GET: odata/GSTPercentages(5)
        [EnableQuery]
        public SingleResult<GSTPercentage> GetGSTPercentage([FromODataUri] int key)
        {
            return SingleResult.Create(db.GSTPercentages.Where(gSTPercentage => gSTPercentage.Id == key));
        }

        // PUT: odata/GSTPercentages(5)
        public IHttpActionResult Put([FromODataUri] int key, Delta<GSTPercentage> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GSTPercentage gSTPercentage = db.GSTPercentages.Find(key);
            if (gSTPercentage == null)
            {
                return NotFound();
            }

            patch.Put(gSTPercentage);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GSTPercentageExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(gSTPercentage);
        }

        // POST: odata/GSTPercentages
        public IHttpActionResult Post(GSTPercentage gSTPercentage)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.GSTPercentages.Add(gSTPercentage);
            db.SaveChanges();

            return Created(gSTPercentage);
        }

        // PATCH: odata/GSTPercentages(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] int key, Delta<GSTPercentage> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GSTPercentage gSTPercentage = db.GSTPercentages.Find(key);
            if (gSTPercentage == null)
            {
                return NotFound();
            }

            patch.Patch(gSTPercentage);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GSTPercentageExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(gSTPercentage);
        }

        // DELETE: odata/GSTPercentages(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            GSTPercentage gSTPercentage = db.GSTPercentages.Find(key);
            if (gSTPercentage == null)
            {
                return NotFound();
            }

            db.GSTPercentages.Remove(gSTPercentage);
            db.SaveChanges();

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

        private bool GSTPercentageExists(int key)
        {
            return db.GSTPercentages.Count(e => e.Id == key) > 0;
        }
    }
}
