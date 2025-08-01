using System.Dynamic;

namespace MailSolution.Api.Services.Interface;

public interface IViewRenderService
{
    Task<string> RenderToStringAsync(string viewName, object model);
    Task<string> RenderToStringAsync(string viewName, ExpandoObject model);
}
    