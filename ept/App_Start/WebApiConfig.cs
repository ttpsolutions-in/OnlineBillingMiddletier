using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Web.Http.OData.Builder;
using System.Web.Http.OData.Extensions;
using ept.Models;
using System.Web.Http.OData;
using System.Web.Http.OData.Query;

namespace ept
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //config.Filters.Add(new AuthorizeAttribute());

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Bill>("Bills");
            builder.EntitySet<Status>("Status");
            builder.EntitySet<SupplierRetailer>("SupplierRetailers");
            builder.EntitySet<SaleCategory>("SaleCategories");
            builder.EntitySet<SaleType>("SaleTypes");
            builder.EntitySet<Sale>("Sales");
            builder.EntitySet<Category>("Categories");
            builder.EntitySet<EmployeeDetail>("EmployeeDetails");
            builder.EntitySet<EmployeeRole>("EmployeeRoles");
            builder.EntitySet<Godown>("Godowns");
            builder.EntitySet<GSTPercentage>("GSTPercentages");
            builder.EntitySet<ItemCategory>("ItemCategories");
            builder.EntitySet<Material>("Materials");
            builder.EntitySet<MaterialInventory>("MaterialInventories");
            builder.EntitySet<SupplierRetailType>("SupplierRetailTypes");
            builder.EntitySet<EmploymentType>("EmploymentTypes");
            builder.EntitySet<EmployeeDesignation>("EmployeeDesignations");
            builder.EntitySet<EmployeeAccount>("EmployeeAccounts");
            builder.EntitySet<PaymentType>("PaymentTypes");
            builder.EntitySet<RightsManagement>("RightsManagements");
            builder.EntitySet<Right>("Rights");
            builder.EntitySet<RoleRightsView>("RoleRightsViews");
            builder.EntitySet<RightsForAssignment>("RightsForAssignments");

            builder.EntitySet<ReorderRequired>("ReorderRequireds");
            builder.EntitySet<BillDetailsView>("BillDetailsViews");

            config.Routes.MapODataServiceRoute("odata", "odata", builder.GetEdmModel());

            config.AddODataQueryFilter(new EnableQueryAttribute
            {
                AllowedQueryOptions = AllowedQueryOptions.All

                //PageSize = configuration.GetValue<int>("OData:PageSize"),
                //MaxNodeCount = configuration.GetValue<int>("OData:MaxNodeCount")

            });
            //config.
            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.Objects;
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

        }
    }
}
