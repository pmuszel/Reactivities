using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : CommandRequestHandler<Command, Result<Unit>>
        {
            public Handler(DataContext context) : base(context)
            {
            }

            public override async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await Context.Activities.FindAsync(request.Id);

                if(activity == null)
                    return null;

                Context.Remove(activity);

                var result = await Context.SaveChangesAsync(cancellationToken) > 0;

                if(!result) return Result<Unit>.Failure("Failed to delete activity");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}