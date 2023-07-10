using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    [Table("Photos")]
    public class Photo
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
    }
}
