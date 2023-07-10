using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : CommandRequestHandler<Command, Result<Unit>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor) : base(context)
            {
                _userAccessor = userAccessor;
            }

            public async override Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await Context.Users.Include(x => x.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());


                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null) return null;

                var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

                if(currentMain != null) currentMain.IsMain = false;

                photo.IsMain = true;

                var success = await Context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem seting main photo from API");
            }
        }
    }
}
