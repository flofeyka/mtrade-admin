import { Link } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Auth() {
	return (
		<div className="bg-[#B3B3B3]/50 h-screen w-full flex flex-col gap-4 justify-center items-center">
			<div className="flex gap-5 justify-center">
				<span className="flex flex-col font-[500] justify-between p-3 text-center text-[#1E1E1E] text-2xl">
					<div>Login</div>
					<div>Path</div>
					<div>Authentificator:</div>
				</span>
				<span className="flex flex-col gap-10">
					<div>
						<Input />
					</div>
					<div>
						<Input />
					</div>
					<div>
						<Input />
					</div>
				</span>
			</div>

			<div>
				<Link to="/dashboard">
					<Button className="w-[200px] mt-10">Sign In...</Button>
				</Link>
			</div>
		</div>
	);
}
