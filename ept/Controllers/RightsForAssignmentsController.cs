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
    builder.EntitySet<RightsForAssignment>("RightsForAssignments";
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class RightsForAssignmentsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/RightsForAssignments
        [EnableQuery]
        public IQueryable<RightsForAssignment> GetRightsForAssignments()
        {
            return db.RightsForAssignments;
        }

        // GET: odata/RightsForAssignments(5)
        [EnableQuery]
        public SingleResult<RightsForAssignment> GetRightsForAssignment([FromODataUri] short key)
        {
            return SingleResult.Create(db.RightsForAssignments.Where(rightsForAssignment => rightsForAssignment.RightsId == key));
        }

        // PUT: odata/RightsForAssignments(5)
        public async Task<IHttpActionResult> Put([FromODataUri] short key, Delta<RightsForAssignment> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RightsForAssignment rightsForAssignment = await db.RightsForAssignments.FindAsync(key);
            if (rightsForAssignment == null)
            {
                return NotFound();
            }

            patch.Put(rightsForAssignment);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RightsForAssignmentExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(rightsForAssignment);
        }

        // POST: odata/RightsForAssignments
        public async Task<IHttpActionResult> Post(RightsForAssignment rightsForAssignment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.RightsForAssignments.Add(rightsForAssignment);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RightsForAssignmentExists(rightsForAssignment.RightsId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Created(rightsForAssignment);
        }

        // PATCH: odata/RightsForAssignments(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<RightsForAssignment> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RightsForAssignment rightsForAssignment = await db.RightsForAssignments.FindAsync(key);
            if (rightsForAssignment == null)
            {
                return NotFound();
            }

            patch.Patch(rightsForAssignment);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RightsForAssignmentExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(rightsForAssignment);
        }

        // DELETE: odata/RightsForAssignments(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] short key)
        {
            RightsForAssignment rightsForAssignment = await db.RightsForAssignments.FindAsync(key);
            if (rightsForAssignment == null)
            {
                return NotFound();
            }

            db.RightsForAssignments.Remove(rightsForAssignment);
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

        private bool RightsForAssignmentExists(short key)
        {
            return db.RightsForAssignments.Count(e => e.RightsId == key) > 0;
        }
    }
}
