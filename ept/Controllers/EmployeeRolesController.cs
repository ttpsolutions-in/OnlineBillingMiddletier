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
    builder.EntitySet<EmployeeRole>("EmployeeRoles";
    builder.EntitySet<EmployeeDetail>("EmployeeDetails"; 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmployeeRolesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/EmployeeRoles
        [EnableQuery]
        public IQueryable<EmployeeRole> GetEmployeeRoles()
        {
            return db.EmployeeRoles;
        }

        // GET: odata/EmployeeRoles(5)
        [EnableQuery]
        public SingleResult<EmployeeRole> GetEmployeeRole([FromODataUri] byte key)
        {
            return SingleResult.Create(db.EmployeeRoles.Where(employeeRole => employeeRole.EmpRoleId == key));
        }

        // PUT: odata/EmployeeRoles(5)
        public IHttpActionResult Put([FromODataUri] byte key, Delta<EmployeeRole> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeRole employeeRole = db.EmployeeRoles.Find(key);
            if (employeeRole == null)
            {
                return NotFound();
            }

            patch.Put(employeeRole);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeRoleExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeRole);
        }

        // POST: odata/EmployeeRoles
        public IHttpActionResult Post(EmployeeRole employeeRole)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EmployeeRoles.Add(employeeRole);
            db.SaveChanges();

            return Created(employeeRole);
        }

        // PATCH: odata/EmployeeRoles(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] byte key, Delta<EmployeeRole> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeRole employeeRole = db.EmployeeRoles.Find(key);
            if (employeeRole == null)
            {
                return NotFound();
            }

            patch.Patch(employeeRole);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeRoleExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeRole);
        }

        // DELETE: odata/EmployeeRoles(5)
        public IHttpActionResult Delete([FromODataUri] byte key)
        {
            EmployeeRole employeeRole = db.EmployeeRoles.Find(key);
            if (employeeRole == null)
            {
                return NotFound();
            }

            db.EmployeeRoles.Remove(employeeRole);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/EmployeeRoles(5)/EmployeeDetails
        [EnableQuery]
        public IQueryable<EmployeeDetail> GetEmployeeDetails([FromODataUri] byte key)
        {
            return db.EmployeeRoles.Where(m => m.EmpRoleId == key).SelectMany(m => m.EmployeeDetails);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeRoleExists(byte key)
        {
            return db.EmployeeRoles.Count(e => e.EmpRoleId == key) > 0;
        }
    }
}
