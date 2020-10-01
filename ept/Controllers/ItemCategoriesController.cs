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
    builder.EntitySet<ItemCategory>("ItemCategories";
    config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());
    */
    public class ItemCategoriesController : ODataController
    {
        private EphraimTradersEntities db = new EphraimTradersEntities();

        // GET: odata/ItemCategories
        [EnableQuery]
        public IQueryable<ItemCategory> GetItemCategories()
        {
            return db.ItemCategories;
        }

        // GET: odata/ItemCategories(5)
        [EnableQuery]
        public SingleResult<ItemCategory> GetItemCategory([FromODataUri] short key)
        {
            return SingleResult.Create(db.ItemCategories.Where(itemCategory => itemCategory.ItemCategoryId == key));
        }

        // PUT: odata/ItemCategories(5)
        public IHttpActionResult Put([FromODataUri] short key, Delta<ItemCategory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ItemCategory itemCategory = db.ItemCategories.Find(key);
            if (itemCategory == null)
            {
                return NotFound();
            }

            patch.Put(itemCategory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemCategoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(itemCategory);
        }

        // POST: odata/ItemCategories
        public IHttpActionResult Post(ItemCategory itemCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ItemCategories.Add(itemCategory);
            db.SaveChanges();

            return Created(itemCategory);
        }

        // PATCH: odata/ItemCategories(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public IHttpActionResult Patch([FromODataUri] short key, Delta<ItemCategory> patch)
        {
            Validate(patch.GetEntity());

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ItemCategory itemCategory = db.ItemCategories.Find(key);
            if (itemCategory == null)
            {
                return NotFound();
            }

            patch.Patch(itemCategory);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemCategoryExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(itemCategory);
        }

        // DELETE: odata/ItemCategories(5)
        public IHttpActionResult Delete([FromODataUri] short key)
        {
            ItemCategory itemCategory = db.ItemCategories.Find(key);
            if (itemCategory == null)
            {
                return NotFound();
            }

            db.ItemCategories.Remove(itemCategory);
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

        private bool ItemCategoryExists(short key)
        {
            return db.ItemCategories.Count(e => e.ItemCategoryId == key) > 0;
        }
    }
}
