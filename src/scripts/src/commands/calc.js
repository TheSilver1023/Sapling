import Command from 'stickycore/command'
import World from 'stickycore/world'

new Command()
	.setName('calc')
	.addArgument('string', 'expression')
	.setCallback(CalcCommand)
	.build();
	
function CalcCommand(sender, { expression }) {
	const regex = /^[0-9+\-\/a-z!%><=*^&?:\{\}();.\s]+$/
	const test = regex.test(expression);
	
	if (!test) return World.sendMessage('§cInvalid Expression');
	
	let parsed_ex = expression;
	for (let x of expression) {
		parsed_ex = parsed_ex
			.replace('^', '**')
			.replace('{', '"')
			.replace('}', '"');
	}
	
	try {
		const res = Function(`return (${parsed_ex})`)().toString();
	
		World.sendMessage(`§q> §r${expression}\n  §u[r]: §h${res}`);
	} catch (e) { World.sendMessage(`§cError with expression evaluation`) }
}