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
    builder.EntitySet<RoleRightsView>("RoleRightsViews");
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class RoleRightsViewsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/RoleRightsViews
        [EnableQuery]
        public IQueryable<RoleRightsView> GetRoleRightsViews()
        {
            return db.RoleRightsViews;
        }

        // GET: odata/RoleRightsViews(5)
        [EnableQuery]
        public SingleResult<RoleRightsView> GetRoleRightsView([FromODataUri] short key)
        {
            return SingleResult.Create(db.RoleRightsViews.Where(roleRightsView => roleRightsView.RightsId == key));
        }

        // PUT: odata/RoleRightsViews(5)
        public async Task<IHttpActionResult> Put([FromODataUri] short key, Delta<RoleRightsView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RoleRightsView roleRightsView = await db.RoleRightsViews.FindAsync(key);
            if (roleRightsView == null)
            {
                return NotFound();
            }

            patch.Put(roleRightsView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleRightsViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(roleRightsView);
        }

        // POST: odata/RoleRightsViews
        public async Task<IHttpActionResult> Post(RoleRightsView roleRightsView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.RoleRightsViews.Add(roleRightsView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RoleRightsViewExists(roleRightsView.RightsId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(roleRightsView);
        }

        // PATCH: odata/RoleRightsViews(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<RoleRightsView> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RoleRightsView roleRightsView = await db.RoleRightsViews.FindAsync(key);
            if (roleRightsView == null)
            {
                return NotFound();
            }

            patch.Patch(roleRightsView);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleRightsViewExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(roleRightsView);
        }

        // DELETE: odata/RoleRightsViews(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] short key)
        {
            RoleRightsView roleRightsView = await db.RoleRightsViews.FindAsync(key);
            if (roleRightsView == null)
            {
                return NotFound();
            }

            db.RoleRightsViews.Remove(roleRightsView);
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

        private bool RoleRightsViewExists(short key)
        {
            return db.RoleRightsViews.Count(e => e.RightsId == key) > 0;
        }
    }
}
