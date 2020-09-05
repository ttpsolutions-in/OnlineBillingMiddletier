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
    builder.EntitySet<EmployeeDesignation>("EmployeeDesignations");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmployeeDesignationsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/EmployeeDesignations
        [EnableQuery]
        public IQueryable<EmployeeDesignation> GetEmployeeDesignations()
        {
            return db.EmployeeDesignations;
        }

        // GET: odata/EmployeeDesignations(5)
        [EnableQuery]
        public SingleResult<EmployeeDesignation> GetEmployeeDesignation([FromODataUri] byte key)
        {
            return SingleResult.Create(db.EmployeeDesignations.Where(employeeDesignation => employeeDesignation.DesignationId == key));
        }

        // PUT: odata/EmployeeDesignations(5)
        public async Task<IHttpActionResult> Put([FromODataUri] byte key, Delta<EmployeeDesignation> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeDesignation employeeDesignation = await db.EmployeeDesignations.FindAsync(key);
            if (employeeDesignation == null)
            {
                return NotFound();
            }

            patch.Put(employeeDesignation);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeDesignationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeDesignation);
        }

        // POST: odata/EmployeeDesignations
        public async Task<IHttpActionResult> Post(EmployeeDesignation employeeDesignation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EmployeeDesignations.Add(employeeDesignation);
            await db.SaveChangesAsync();

            return Created(employeeDesignation);
        }

        // PATCH: odata/EmployeeDesignations(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] byte key, Delta<EmployeeDesignation> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeDesignation employeeDesignation = await db.EmployeeDesignations.FindAsync(key);
            if (employeeDesignation == null)
            {
                return NotFound();
            }

            patch.Patch(employeeDesignation);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeDesignationExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeDesignation);
        }

        // DELETE: odata/EmployeeDesignations(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] byte key)
        {
            EmployeeDesignation employeeDesignation = await db.EmployeeDesignations.FindAsync(key);
            if (employeeDesignation == null)
            {
                return NotFound();
            }

            db.EmployeeDesignations.Remove(employeeDesignation);
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

        private bool EmployeeDesignationExists(byte key)
        {
            return db.EmployeeDesignations.Count(e => e.DesignationId == key) > 0;
        }
    }
}
