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
    builder.EntitySet<Unit>("Units");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class UnitsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/Units
        [EnableQuery]
        public IQueryable<Unit> GetUnits()
        {
            return db.Units;
        }

        // GET: odata/Units(5)
        [EnableQuery]
        public SingleResult<Unit> GetUnit([FromODataUri] byte key)
        {
            return SingleResult.Create(db.Units.Where(unit => unit.UnitId == key));
        }

        // PUT: odata/Units(5)
        public IHttpActionResult Put([FromODataUri] byte key, Delta<Unit> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Unit unit = db.Units.Find(key);
            if (unit == null)
            {
                return NotFound();
            }

            patch.Put(unit);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UnitExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(unit);
        }

        // POST: odata/Units
        public IHttpActionResult Post(Unit unit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Units.Add(unit);
            db.SaveChanges();

            return Created(unit);
        }

        // PATCH: odata/Units(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] byte key, Delta<Unit> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Unit unit = db.Units.Find(key);
            if (unit == null)
            {
                return NotFound();
            }

            patch.Patch(unit);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UnitExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(unit);
        }

        // DELETE: odata/Units(5)
        public IHttpActionResult Delete([FromODataUri] byte key)
        {
            Unit unit = db.Units.Find(key);
            if (unit == null)
            {
                return NotFound();
            }

            db.Units.Remove(unit);
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

        private bool UnitExists(byte key)
        {
            return db.Units.Count(e => e.UnitId == key) > 0;
        }
    }
}
