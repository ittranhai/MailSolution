using MailKit.Net.Smtp;
using MailKit.Security;
using MailSolution.Api.Common;
using MailSolution.Api.Models;
using MailSolution.Api.Services.Interface;
using Microsoft.Extensions.Options;
using MimeKit;


namespace MailSolution.Api.Services.Inplement;

public class MailService : IMailService
{
    private readonly ServiceSetting _serviceSetting;
    public MailService(IOptionsSnapshot<ServiceSetting> serviceSetting)
    {
        _serviceSetting = serviceSetting.Value;
    }
    public async Task SendEmailAsync(MailModel mailmodel)
    {
        var email = new MimeMessage();
        email.Sender = MailboxAddress.Parse(_serviceSetting.MailSetting.Mail);
        email.To.Add(MailboxAddress.Parse(mailmodel.ToEmail));
        email.Subject = mailmodel.Subject;
        var builder = new BodyBuilder();
        if (mailmodel.Attachments != null)
        {
            byte[] fileBytes;
            foreach (var file in mailmodel.Attachments)
            {
                if (file.Length > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        fileBytes = ms.ToArray();
                    }
                    builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                }
            }
        }
        builder.HtmlBody = mailmodel.Body;
        email.Body = builder.ToMessageBody();
        using var smtp = new SmtpClient();
        smtp.Connect(_serviceSetting.MailSetting.Host, _serviceSetting.MailSetting.Port, SecureSocketOptions.StartTls);
        smtp.Authenticate(_serviceSetting.MailSetting.Mail, _serviceSetting.MailSetting.Password);
        await smtp.SendAsync(email);
        smtp.Disconnect(true);
    }
}