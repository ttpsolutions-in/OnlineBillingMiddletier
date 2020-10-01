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
    builder.EntitySet<EmployeeAttendance>("EmployeeAttendances");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmployeeAttendancesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/EmployeeAttendances
        [EnableQuery]
        public IQueryable<EmployeeAttendance> GetEmployeeAttendances()
        {
            return db.EmployeeAttendances;
        }

        // GET: odata/EmployeeAttendances(5)
        [EnableQuery]
        public SingleResult<EmployeeAttendance> GetEmployeeAttendance([FromODataUri] int key)
        {
            return SingleResult.Create(db.EmployeeAttendances.Where(employeeAttendance => employeeAttendance.AttendanceId == key));
        }

        // PUT: odata/EmployeeAttendances(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Delta<EmployeeAttendance> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeAttendance employeeAttendance = await db.EmployeeAttendances.FindAsync(key);
            if (employeeAttendance == null)
            {
                return NotFound();
            }

            patch.Put(employeeAttendance);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeAttendanceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeAttendance);
        }

        // POST: odata/EmployeeAttendances
        public async Task<IHttpActionResult> Post(EmployeeAttendance employeeAttendance)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EmployeeAttendances.Add(employeeAttendance);
            await db.SaveChangesAsync();

            return Created(employeeAttendance);
        }

        // PATCH: odata/EmployeeAttendances(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<EmployeeAttendance> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeAttendance employeeAttendance = await db.EmployeeAttendances.FindAsync(key);
            if (employeeAttendance == null)
            {
                return NotFound();
            }

            patch.Patch(employeeAttendance);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeAttendanceExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeAttendance);
        }

        // DELETE: odata/EmployeeAttendances(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            EmployeeAttendance employeeAttendance = await db.EmployeeAttendances.FindAsync(key);
            if (employeeAttendance == null)
            {
                return NotFound();
            }

            db.EmployeeAttendances.Remove(employeeAttendance);
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

        private bool EmployeeAttendanceExists(int key)
        {
            return db.EmployeeAttendances.Count(e => e.AttendanceId == key) > 0;
        }
    }
}
