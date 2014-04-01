package sgq.cmd.bean;

import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable = "true")
public class Word {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@Extension(vendorName = "datanucleus", key = "gae.encoded-pk", value = "true")
	private String wordId;
	@Persistent
	private String hiragana;
	@Persistent
	private String chinese;
	@Persistent
	private String japanese;
	@Persistent
	private String remark;
	@Persistent
	private WordSet wordSet;
	@Persistent
	private int lessonNo;
	@Persistent
	private String type;
	public String getWordId() {
		return wordId;
	}
	public void setWordId(String wordId) {
		this.wordId = wordId;
	}
	public String getHiragana() {
		return hiragana;
	}
	public void setHiragana(String hiragana) {
		this.hiragana = hiragana;
	}
	public String getChinese() {
		return chinese;
	}
	public void setChinese(String chinese) {
		this.chinese = chinese;
	}
	public String getJapanese() {
		return japanese;
	}
	public void setJapanese(String japanese) {
		this.japanese = japanese;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public WordSet getWordSet() {
		return wordSet;
	}
	public void setWordSet(WordSet wordSet) {
		this.wordSet = wordSet;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getLessonNo() {
		return lessonNo;
	}
	public void setLessonNo(int lessonNo) {
		this.lessonNo = lessonNo;
	}
	public String toString() {
		return this.chinese + " " + this.hiragana + " " + this.japanese + " " + this.lessonNo + " " + this.type + " " + this.remark;
	}
}
