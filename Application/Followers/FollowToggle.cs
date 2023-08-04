using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
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
                var observer = await Context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                var target = await Context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if (target == null) return null;

                var following = await Context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target,
                    };

                    Context.UserFollowings.Add(following);
                }
                else
                {
                    Context.UserFollowings.Remove(following);
                }

                var success = await Context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}
