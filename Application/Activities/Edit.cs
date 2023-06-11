using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : CommandRequestHandler<Command>
        {
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper) : base(context) 
            { 
                _mapper = mapper;
            }

            public override async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await Context.Activities.FindAsync(request.Activity.Id);

                _mapper.Map(request.Activity, activity);

                await Context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}