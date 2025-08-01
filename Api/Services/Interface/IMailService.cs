using MailSolution.Api.Models;

namespace MailSolution.Api.Services.Interface;
public interface IMailService
{
    Task SendEmailAsync(MailModel mailmodel);
}