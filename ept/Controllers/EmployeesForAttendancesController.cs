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
    builder.EntitySet<EmployeesForAttendance>("EmployeesForAttendances");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmployeesForAttendancesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/EmployeesForAttendances
        [EnableQuery]
        public IQueryable<EmployeesForAttendance> GetEmployeesForAttendances()
        {
            return db.EmployeesForAttendances;
        }

        // GET: odata/EmployeesForAttendances(5)
        [EnableQuery]
        public SingleResult<EmployeesForAttendance> GetEmployeesForAttendance([FromODataUri] string key)
        {
            return SingleResult.Create(db.EmployeesForAttendances.Where(employeesForAttendance => employeesForAttendance.EmployeeName == key));
        }

        // PUT: odata/EmployeesForAttendances(5)
        public async Task<IHttpActionResult> Put([FromODataUri] string key, Delta<EmployeesForAttendance> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeesForAttendance employeesForAttendance = await db.EmployeesForAttendances.FindAsync(key);
            if (employeesForAttendance == null)
            {
                return NotFound();
            }

            patch.Put(employeesForAttendance);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeesForAttendanceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeesForAttendance);
        }

        // POST: odata/EmployeesForAttendances
        public async Task<IHttpActionResult> Post(EmployeesForAttendance employeesForAttendance)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EmployeesForAttendances.Add(employeesForAttendance);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EmployeesForAttendanceExists(employeesForAttendance.EmployeeName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(employeesForAttendance);
        }

        // PATCH: odata/EmployeesForAttendances(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<EmployeesForAttendance> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeesForAttendance employeesForAttendance = await db.EmployeesForAttendances.FindAsync(key);
            if (employeesForAttendance == null)
            {
                return NotFound();
            }

            patch.Patch(employeesForAttendance);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeesForAttendanceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeesForAttendance);
        }

        // DELETE: odata/EmployeesForAttendances(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] string key)
        {
            EmployeesForAttendance employeesForAttendance = await db.EmployeesForAttendances.FindAsync(key);
            if (employeesForAttendance == null)
            {
                return NotFound();
            }

            db.EmployeesForAttendances.Remove(employeesForAttendance);
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

        private bool EmployeesForAttendanceExists(string key)
        {
            return db.EmployeesForAttendances.Count(e => e.EmployeeName == key) > 0;
        }
    }
}
