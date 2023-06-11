using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : CommandRequestHandler<Command>
        {
            public Handler(DataContext context) : base(context) { }

            public async override Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Context.Activities.Add(request.Activity);
                await Context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}