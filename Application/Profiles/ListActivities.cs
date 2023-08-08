using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>> 
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities.Where(x => x.Attendees.Any(a => a.AppUser.UserName == request.Username))
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).AsQueryable();

                var queryIsHost = _context.Activities.Where(x => x.Attendees.Any(a => a.AppUser.UserName == request.Username && a.IsHost))
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider).AsQueryable();


                List<UserActivityDto> userActivities = null;

                switch (request.Predicate)
                {
                    case "past":
                        userActivities = await query.Where(x => x.Date < DateTime.UtcNow).ToListAsync();
                        break;
                    case "future":
                        userActivities = await query.Where(x => x.Date >= DateTime.UtcNow).ToListAsync();
                        break;
                    case "hosting":
                        userActivities = await queryIsHost.ToListAsync();
                        break;
                }

                return Result<List<UserActivityDto>>.Success(userActivities);
            }
        }
    }
}
