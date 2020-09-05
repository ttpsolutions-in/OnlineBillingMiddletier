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
    builder.EntitySet<EmploymentType>("EmploymentTypes");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmploymentTypesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/EmploymentTypes
        [EnableQuery]
        public IQueryable<EmploymentType> GetEmploymentTypes()
        {
            return db.EmploymentTypes;
        }

        // GET: odata/EmploymentTypes(5)
        [EnableQuery]
        public SingleResult<EmploymentType> GetEmploymentType([FromODataUri] byte key)
        {
            return SingleResult.Create(db.EmploymentTypes.Where(employmentType => employmentType.EmploymentTypeId == key));
        }

        // PUT: odata/EmploymentTypes(5)
        public IHttpActionResult Put([FromODataUri] byte key, Delta<EmploymentType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmploymentType employmentType = db.EmploymentTypes.Find(key);
            if (employmentType == null)
            {
                return NotFound();
            }

            patch.Put(employmentType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmploymentTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employmentType);
        }

        // POST: odata/EmploymentTypes
        public IHttpActionResult Post(EmploymentType employmentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EmploymentTypes.Add(employmentType);
            db.SaveChanges();

            return Created(employmentType);
        }

        // PATCH: odata/EmploymentTypes(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] byte key, Delta<EmploymentType> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmploymentType employmentType = db.EmploymentTypes.Find(key);
            if (employmentType == null)
            {
                return NotFound();
            }

            patch.Patch(employmentType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmploymentTypeExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employmentType);
        }

        // DELETE: odata/EmploymentTypes(5)
        public IHttpActionResult Delete([FromODataUri] byte key)
        {
            EmploymentType employmentType = db.EmploymentTypes.Find(key);
            if (employmentType == null)
            {
                return NotFound();
            }

            db.EmploymentTypes.Remove(employmentType);
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

        private bool EmploymentTypeExists(byte key)
        {
            return db.EmploymentTypes.Count(e => e.EmploymentTypeId == key) > 0;
        }
    }
}
