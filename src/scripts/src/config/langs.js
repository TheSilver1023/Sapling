import Dynamic from 'stickycore/dynamic'
import World from 'stickycore/world'

const lang = { EN: {}, ES: {}, PT: {}, CN: {}, JA: {} }
// Declarations

/* English: EN */
lang.EN.invalidValue = '§cInvalid value'
lang.EN.invalidLang = '§cInvalid lang'
lang.EN.invalidAction = '§eInvalid action to repeat'
lang.EN.fakeplayerInvalid = '§7You can only manipulate existing players'
lang.EN.fakeplayerConnected = '§7$val are connected' // $val refers to the name of a player
lang.EN.newLang = '§bnew lang set'
lang.EN.enabled = '§7$val enabled' // $val refers to a function (for example: tntDuping)
lang.EN.disabled = '§7$val disabled' // $val refers to a function (for example: tntDuping)
lang.EN.prof = '§7Evaluating world data...'
lang.EN.notData = '§7No stored data found'


/* Español: ES */
lang.ES.invalidValue = '§cValor inválido'
lang.ES.invalidLang = '§cIdioma inválido'
lang.ES.invalidAction = '§eAcción inválida para repetir'
lang.ES.fakeplayerInvalid = '§7Solo puedes manipular jugadores existentes'
lang.ES.fakeplayerConnected = '§7$val están conectados' // $val se refiere al nombre de un jugador
lang.ES.newLang = '§bnuevo idioma establecido'
lang.ES.enabled = '§7$val habilitado' // $val se refiere a una función (por ejemplo: tntDuping)
lang.ES.disabled = '§7$val deshabilitado' // $val se refiere a una función (por ejemplo: tntDuping)
lang.ES.prof = '§7Evaluando datos del mundo...'
lang.ES.notData = '§7No se encontraron datos almacenados'


/* Português: PT */
lang.PT.invalidValue = '§cValor inválido'
lang.PT.invalidLang = '§cLinguagem inválida'
lang.PT.invalidAction = '§eAção inválida para repetir'
lang.PT.fakeplayerInvalid = '§7Você só pode manipular jogadores existentes'
lang.PT.fakeplayerConnected = '§7$val estão conectados' // $val refere-se ao nome de um jogador
lang.PT.newLang = '§bnovo idioma definido'
lang.PT.enabled = '§7$val habilitado' // $val refere-se a uma função (por exemplo: tntDuping)
lang.PT.disabled = '§7$val desabilitado' // $val refere-se a uma função (por exemplo: tntDuping)
lang.PT.prof = '§7Avaliando dados do mundo...'
lang.PT.notData = '§7Nenhum dado armazenado encontrado'


/* 中國人: CN */
lang.CN.invalidValue = '§c无效值'
lang.CN.invalidLang = '§c无效语言'
lang.CN.invalidAction = '§e无效的重复操作'
lang.CN.fakeplayerInvalid = '§7您只能操纵现有玩家'
lang.CN.fakeplayerConnected = '§7$val 已连接' // $val 指的是玩家的名称
lang.CN.newLang = '§b新语言设置'
lang.CN.enabled = '§7$val 已启用' // $val 指的是一个功能（例如：tntDuping）
lang.CN.disabled = '§7$val 已禁用' // $val 指的是一个功能（例如：tntDuping）
lang.CN.prof = '§7评估世界数据中...'
lang.CN.notData = '§7未找到存储的数据'


/* 日本語：JA*/
lang.JA.invalidValue = '§c無効な値'
lang.JA.invalidLang = '§c無効な言語'
lang.JA.invalidAction = '§e無効な繰り返しアクション'
lang.JA.fakeplayerInvalid = '§7既存のプレイヤーのみ操作できます'
lang.JA.fakeplayerConnected = '§7$val が接続されています' // $val はプレイヤーの名前を指します
lang.JA.newLang = '§b新しい言語が設定されました'
lang.JA.enabled = '§7$val が有効になりました' // $val は機能を指します（例：tntDuping）
lang.JA.disabled = '§7$val が無効になりました' // $val は機能を指します（例：tntDuping）
lang.JA.prof = '§7ワールドデータを評価しています...'
lang.JA.notData = '§7保存されたデータが見つかりませんでした'



function LANG(key, replace = '') {
	const keys = Dynamic.getData('lang');
	const vals = lang[keys];
	
	World.sendMessage(vals[key].replace('$val', replace));
}

// Exports
export default LANG;