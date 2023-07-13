using Domain;
using FluentValidation;

namespace Application.Profiles
{
    public class EditProfileDtoValidator : AbstractValidator<EditProfileDto>
    {
        public EditProfileDtoValidator()
        {
            RuleFor(x => x.DisplayName).NotEmpty();        
        }
    }
}
