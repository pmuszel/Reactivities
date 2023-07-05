using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application
{
    public class CommandRequestHandler<T, Tout> : IRequestHandler<T, Tout> where T : IRequest<Tout>
    {
        protected DataContext Context {get; private set;}
        public CommandRequestHandler(DataContext context)
        {
            Context = context;        
        }

        public virtual Task<Tout> Handle(T request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}