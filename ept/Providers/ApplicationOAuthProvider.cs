using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using ept.Models;

namespace ept.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            //Startup.OAuthOptions.AccessTokenExpireTimeSpan = TimeSpan.FromHours(24);
            var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

            ApplicationUser user = await userManager.FindAsync(context.UserName, context.Password);

            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }

            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager,
               OAuthDefaults.AuthenticationType);
            ClaimsIdentity cookiesIdentity = await user.GenerateUserIdentityAsync(userManager,
                CookieAuthenticationDefaults.AuthenticationType);

            AuthenticationProperties properties = CreateProperties(user.UserName);
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
            context.Validated(ticket);
            context.Request.Context.Authentication.SignIn(cookiesIdentity);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }
            
            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            ///////////////////////////////////////
            ///
            //string clientId = string.Empty;
            //string clientSecret = string.Empty;
            ////// The TryGetBasicCredentials method checks the Authorization header and
            ////// Return the ClientId and clientSecret
            ////if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            ////{
            ////    context.SetError("invalid_client", "Client credentials could not be retrieved through the Authorization header.");
            ////    return Task.FromResult<object>(null);
            ////}
            ////Check the existence of by calling the ValidateClient method
            //ClientMaster client = (new ClientMasterRepository()).ValidateClient(clientId);//, clientSecret);
            //if (client == null)
            //{
            //    // Client could not be validated.
            //    context.SetError("invalid_client", "Client credentials are invalid.");
            //    return Task.FromResult<object>(null);
            //}
            //else
            //{
            //    if (!client.Active)
            //    {
            //        context.SetError("invalid_client", "Client is inactive.");
            //        return Task.FromResult<object>(null);
            //    }
            //    // Client has been verified.
            //    context.OwinContext.Set<ClientMaster>("ta:client", client);
            //    context.OwinContext.Set<string>("ta:clientAllowedOrigin", client.AllowedOrigin);
            //    context.OwinContext.Set<string>("ta:clientRefreshTokenLifeTime", client.RefreshTokenLifeTime.ToString());
            //    context.Validated();
            //    return Task.FromResult<object>(null);
            //}

            ///////////////////////////////////////
            // Resource owner password credentials does not provide a client ID.

            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(string userName)
        {
            IDictionary<string, string> data = new Dictionary<string, string>
            {
                { "userName", userName }
            };
            return new AuthenticationProperties(data);
        }
    }
}