export default function SignInForm() {
    return (
        <div className="loginForm">
            <div class="field">
                <label class="label">Pseudo</label>
                <div class="control">
                    <input class="input" type="email" placeholder="Text input" value="example@example.com" />
                </div>
            </div>

            <div class="field">
                <label class="label">Email</label>
                <div class="control">
                    <input class="input" type="email" placeholder="Text input" value="example@example.com" />
                </div>
            </div>

            <div class="field">
                <label class="label">Mot de passe</label>
                <div class="control">
                    <input class="input" type="password" placeholder="Text input" value="*****" />
                </div>
            </div>

            <div class="field is-grouped mt-4">
                <div class="control">
                    <button class="button is-link is-outlined">S'inscrire</button>
                </div>
            </div>
            <span>
                Vous avez déjà un compte ? se connecter.
            </span>
        </div>
    )
}