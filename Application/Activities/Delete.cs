using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : CommandRequestHandler<Command>
        {
            public Handler(DataContext context) : base(context)
            {
            }

            public override async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await Context.Activities.FindAsync(request.Id);

                Context.Remove(activity);

                await Context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}