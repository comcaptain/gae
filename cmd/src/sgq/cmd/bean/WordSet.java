package sgq.cmd.bean;

import java.util.HashSet;
import java.util.Set;

import javax.jdo.annotations.Element;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION, detachable = "true")
public class WordSet {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Long wordSetId;
	@Persistent
	private String name;
	@Persistent
	private String description;
	@Persistent(mappedBy = "wordSet")
	@Element(dependent = "true")
	private Set<Word> words = new HashSet<Word>();
	public Long getWordSetId() {
		return wordSetId;
	}
	public void setWordSetId(Long wordSetId) {
		this.wordSetId = wordSetId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Set<Word> getWords() {
		return words;
	}
	public void setWords(Set<Word> words) {
		this.words = words;
	}
	public void addWord(Word word) {
		this.words.add(word);
	}
	public void deleteWord(Word word) {
		this.words.remove(word);
	}
}
