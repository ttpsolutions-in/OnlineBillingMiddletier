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
    builder.EntitySet<EmployeeDetail>("EmployeeDetails";
    builder.EntitySet<EmployeeRole>("EmployeeRoles"; 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class EmployeeDetailsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/EmployeeDetails
        [EnableQuery]
        public IQueryable<EmployeeDetail> GetEmployeeDetails()
        {
            return db.EmployeeDetails;
        }

        // GET: odata/EmployeeDetails(5)
        [EnableQuery]
        public SingleResult<EmployeeDetail> GetEmployeeDetail([FromODataUri] short key)
        {
            return SingleResult.Create(db.EmployeeDetails.Where(employeeDetail => employeeDetail.EmployeeNo == key));
        }

        // PUT: odata/EmployeeDetails(5)
        public IHttpActionResult Put([FromODataUri] short key, Delta<EmployeeDetail> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeDetail employeeDetail = db.EmployeeDetails.Find(key);
            if (employeeDetail == null)
            {
                return NotFound();
            }

            patch.Put(employeeDetail);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeDetailExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeDetail);
        }

        // POST: odata/EmployeeDetails
        public IHttpActionResult Post(EmployeeDetail employeeDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EmployeeDetails.Add(employeeDetail);
            db.SaveChanges();

            return Created(employeeDetail);
        }

        // PATCH: odata/EmployeeDetails(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] short key, Delta<EmployeeDetail> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            EmployeeDetail employeeDetail = db.EmployeeDetails.Find(key);
            if (employeeDetail == null)
            {
                return NotFound();
            }

            patch.Patch(employeeDetail);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeDetailExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(employeeDetail);
        }

        // DELETE: odata/EmployeeDetails(5)
        public IHttpActionResult Delete([FromODataUri] short key)
        {
            EmployeeDetail employeeDetail = db.EmployeeDetails.Find(key);
            if (employeeDetail == null)
            {
                return NotFound();
            }

            db.EmployeeDetails.Remove(employeeDetail);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/EmployeeDetails(5)/EmployeeRole
        [EnableQuery]
        public SingleResult<EmployeeRole> GetEmployeeRole([FromODataUri] short key)
        {
            return SingleResult.Create(db.EmployeeDetails.Where(m => m.EmployeeNo == key).Select(m => m.EmployeeRole));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeDetailExists(short key)
        {
            return db.EmployeeDetails.Count(e => e.EmployeeNo == key) > 0;
        }
    }
}
