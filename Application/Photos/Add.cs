using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : CommandRequestHandler<Command, Result<Photo>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor) : base(context)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async override Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await Context.Users.Include(x => x.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId,
                };

                if(!user.Photos.Any(x => x.IsMain))
                {
                    photo.IsMain = true;
                }

                user.Photos.Add(photo);

                var result = await Context.SaveChangesAsync() > 0;

                if(result) return Result<Photo>.Success(photo);

                return Result<Photo>.Failure("Problem adding photo");

            }
        }
    }
}
