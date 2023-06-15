using Microsoft.AspNetCore.Diagnostics;

namespace Application.Core
{
    public class AppException
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }

        public AppException(int statusCode, string message, string detail = null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = detail;
        }
    }
}