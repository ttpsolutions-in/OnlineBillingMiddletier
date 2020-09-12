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
    builder.EntitySet<RightsManagement>("RightsManagements");
    builder.EntitySet<EmployeeRole>("EmployeeRoles"); 
    builder.EntitySet<Right>("Rights"); 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class RightsManagementsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/RightsManagements
        [EnableQuery]
        public IQueryable<RightsManagement> GetRightsManagements()
        {
            return db.RightsManagements;
        }

        // GET: odata/RightsManagements(5)
        [EnableQuery]
        public SingleResult<RightsManagement> GetRightsManagement([FromODataUri] byte key)
        {
            return SingleResult.Create(db.RightsManagements.Where(rightsManagement => rightsManagement.RightsManagementId == key));
        }

        // PUT: odata/RightsManagements(5)
        public async Task<IHttpActionResult> Put([FromODataUri] byte key, Delta<RightsManagement> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RightsManagement rightsManagement = await db.RightsManagements.FindAsync(key);
            if (rightsManagement == null)
            {
                return NotFound();
            }

            patch.Put(rightsManagement);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RightsManagementExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(rightsManagement);
        }

        // POST: odata/RightsManagements
        public async Task<IHttpActionResult> Post(RightsManagement rightsManagement)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.RightsManagements.Add(rightsManagement);
            await db.SaveChangesAsync();

            return Created(rightsManagement);
        }

        // PATCH: odata/RightsManagements(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] byte key, Delta<RightsManagement> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RightsManagement rightsManagement = await db.RightsManagements.FindAsync(key);
            if (rightsManagement == null)
            {
                return NotFound();
            }

            patch.Patch(rightsManagement);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RightsManagementExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(rightsManagement);
        }

        // DELETE: odata/RightsManagements(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] byte key)
        {
            RightsManagement rightsManagement = await db.RightsManagements.FindAsync(key);
            if (rightsManagement == null)
            {
                return NotFound();
            }

            db.RightsManagements.Remove(rightsManagement);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/RightsManagements(5)/EmployeeRole
        [EnableQuery]
        public SingleResult<EmployeeRole> GetEmployeeRole([FromODataUri] byte key)
        {
            return SingleResult.Create(db.RightsManagements.Where(m => m.RightsManagementId == key).Select(m => m.EmployeeRole));
        }

        // GET: odata/RightsManagements(5)/Right
        [EnableQuery]
        public SingleResult<Right> GetRight([FromODataUri] byte key)
        {
            return SingleResult.Create(db.RightsManagements.Where(m => m.RightsManagementId == key).Select(m => m.Right));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RightsManagementExists(byte key)
        {
            return db.RightsManagements.Count(e => e.RightsManagementId == key) > 0;
        }
    }
}
