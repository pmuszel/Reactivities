using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> 
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ILogger<List> _logger;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, ILogger<List> logger, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _logger = logger;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // try
                // {
                //     for(int i = 0; i < 10; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000, cancellationToken);
                //         _logger.LogInformation($"Task {i} has compleated");
                //     }
                // }
                // catch(Exception ex)
                // {
                //     _logger.LogInformation("Task was canceled!");
                // }

                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName()})
                // .Include(x => x.Attendees)
                // .ThenInclude(x => x.AppUser)
                    .ToListAsync(cancellationToken);

                //var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}