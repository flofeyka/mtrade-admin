import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Auth() {
	return (
		<div className="bg-[#B3B3B3]/50 h-screen w-full flex flex-col gap-4 justify-center items-center">
			<div className="flex justify-center">
				<span className="flex flex-col items-center gap-10 text-2xl">
					<div className="flex items-center max-sm:flex-col max-sm:items-start">
						<div className="w-[185px] text-center max-sm:text-start max-sm:w-auto">
							Login
						</div>
						<Input className="max-sm:w-[80vw]" />
					</div>
					<div className="flex items-center max-sm:flex-col max-sm:items-start">
						<div className="w-[185px] text-center max-sm:text-start max-sm:w-auto">
							Path
						</div>
						<Input className="max-sm:w-[80vw]" />
					</div>
					<div className="flex items-center max-sm:flex-col max-sm:items-start">
						<div className="w-[185px] text-center max-sm:text-start max-sm:w-auto">
							Authentificator:
						</div>
						<Input className="max-sm:w-[80vw]" />
					</div>
				</span>
			</div>

			<div>
				<Link to="/dashboard">
					<Button className="w-[200px] max-sm:w-[80vw] max-sm:h-[60px] text-2xl mt-10">
						Sign In...
					</Button>
				</Link>
			</div>
		</div>
	);
}
