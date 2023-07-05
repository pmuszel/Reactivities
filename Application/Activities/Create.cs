using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor) : base(context) 
            {
                _userAccessor = userAccessor;
            }

            public async override Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await Context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true,
                };

                request.Activity.Attendees.Add(attendee);

                Context.Activities.Add(request.Activity);

                var result = await Context.SaveChangesAsync(cancellationToken) > 0;

                if(!result) return Result<Unit>.Failure("Failed to create activity");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}