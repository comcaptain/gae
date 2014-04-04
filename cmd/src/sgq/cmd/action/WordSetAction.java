package sgq.cmd.action;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import sgq.cmd.bean.Word;
import sgq.cmd.bean.WordSet;
import sgq.cmd.util.PMF;

import com.opensymphony.xwork2.ActionSupport;

public class WordSetAction extends ActionSupport{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6755577083032284008L;
	private List<WordSet> wordSetList;
	private long wordSetId;
	private List<Word> wordList;
	public List<WordSet> getWordSetList() {
		return wordSetList;
	}
	public void setWordSetList(List<WordSet> wordSetList) {
		this.wordSetList = wordSetList;
	}
	@SuppressWarnings("unchecked")
	public String retrieveWordSetList() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(WordSet.class);
			this.wordSetList = (List<WordSet>) query.execute();
		}
		finally {
			pm.close();
		}
		return SUCCESS;
	}
	public String retrieveWordList() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			WordSet wordSet = pm.getObjectById(WordSet.class, this.getWordSetId());
			this.wordList = (List<Word>) pm.detachCopyAll(wordSet.getWords());
		}
		finally {
			pm.close();
		}
		return SUCCESS;
	}
	public long getWordSetId() {
		return wordSetId;
	}
	public void setWordSetId(long wordSetId) {
		this.wordSetId = wordSetId;
	}
	public List<Word> getWordList() {
		return wordList;
	}
	public void setWordList(List<Word> wordList) {
		this.wordList = wordList;
	}
}
