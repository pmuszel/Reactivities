using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : CommandRequestHandler<Command, Result<Unit>>
        {
            public Handler(DataContext context) : base(context) { }

            public async override Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Context.Activities.Add(request.Activity);

                var result = await Context.SaveChangesAsync(cancellationToken) > 0;

                if(!result) return Result<Unit>.Failure("Failed to create activity");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}