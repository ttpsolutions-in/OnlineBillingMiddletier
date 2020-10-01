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
    builder.EntitySet<Right>("Rights";
    builder.EntitySet<RightsManagement>("RightsManagements"; 
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class RightsController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/Rights
        [EnableQuery]
        public IQueryable<Right> GetRights()
        {
            return db.Rights;
        }

        // GET: odata/Rights(5)
        [EnableQuery]
        public SingleResult<Right> GetRight([FromODataUri] short key)
        {
            return SingleResult.Create(db.Rights.Where(right => right.RightsId == key));
        }

        // PUT: odata/Rights(5)
        public async Task<IHttpActionResult> Put([FromODataUri] short key, Delta<Right> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Right right = await db.Rights.FindAsync(key);
            if (right == null)
            {
                return NotFound();
            }

            patch.Put(right);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RightExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(right);
        }

        // POST: odata/Rights
        public async Task<IHttpActionResult> Post(Right right)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Rights.Add(right);
            await db.SaveChangesAsync();

            return Created(right);
        }

        // PATCH: odata/Rights(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<Right> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Right right = await db.Rights.FindAsync(key);
            if (right == null)
            {
                return NotFound();
            }

            patch.Patch(right);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RightExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(right);
        }

        // DELETE: odata/Rights(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] short key)
        {
            Right right = await db.Rights.FindAsync(key);
            if (right == null)
            {
                return NotFound();
            }

            db.Rights.Remove(right);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET: odata/Rights(5)/RightsManagements
        [EnableQuery]
        public IQueryable<RightsManagement> GetRightsManagements([FromODataUri] short key)
        {
            return db.Rights.Where(m => m.RightsId == key).SelectMany(m => m.RightsManagements);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RightExists(short key)
        {
            return db.Rights.Count(e => e.RightsId == key) > 0;
        }
    }
}
