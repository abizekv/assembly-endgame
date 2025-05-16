export default function LanguageChip(props) {
const styles = {
    backgroundColor:props.backgroundColor,
    color:props.color
}
    return (
        <div 
        className={props.className}
        style={styles}
        >
            {props.name}
        </div>
    )
}